"use client";
import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductReviews, addProductReview } from "@/firebase/storeActions";
import { getCurrentUser } from "@/firebase/authActions";
import { toast } from "sonner";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkUser();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const reviewsData = await getProductReviews(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول لإضافة تقييم');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    setSubmitting(true);
    try {
      const success = await addProductReview(productId, user.uid, {
        rating: newReview.rating,
        comment: newReview.comment,
        userName: user.displayName || 'مستخدم'
      });

      if (success) {
        toast.success('تم إضافة التقييم بنجاح');
        setNewReview({ rating: 5, comment: "" });
        setShowAddReview(false);
        fetchReviews();
      } else {
        toast.error('فشل في إضافة التقييم');
      }
    } catch (error) {
      toast.error('خطأ في إضافة التقييم');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              size={16}
              className={`${
                star <= rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-white/30'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/10 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">التقييمات والمراجعات</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-white/80">
                {averageRating.toFixed(1)} من 5 ({reviews.length} تقييم)
              </span>
            </div>
          )}
        </div>
        
        {user && (
          <Button
            onClick={() => setShowAddReview(!showAddReview)}
            className="bg-primary text-black hover:bg-primary/80"
          >
            إضافة تقييم
          </Button>
        )}
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">إضافة تقييم جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">التقييم</label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">التعليق</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="اكتب تقييمك للمنتج..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="bg-primary text-black hover:bg-primary/80"
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddReview(false)}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <User size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد تقييمات لهذا المنتج بعد</p>
            <p className="text-sm">كن أول من يقيم هذا المنتج!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">{review.userName}</span>
                      {renderStars(review.rating)}
                      <span className="text-white/60 text-sm">
                        {review.createdAt.toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}