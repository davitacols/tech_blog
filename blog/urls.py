# blog/urls.py
from django.urls import path
from .views import (
    BlogPostListCreate,
    BlogPostDetail,
    CategoryListCreate,
    CommentListCreate,
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
)

urlpatterns = [
    path('categories/', CategoryListCreate.as_view(), name='category-list-create'),
    path('posts/', BlogPostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', BlogPostDetail.as_view(), name='post-detail'),
    path('comments/', CommentListCreate.as_view(), name='comment-list-create'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
]
