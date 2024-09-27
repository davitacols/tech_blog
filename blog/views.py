from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenBlacklistView
from .models import BlogPost, Category, Comment
from .serializers import (
    BlogPostSerializer,
    CategorySerializer,
    CommentSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
)

class UserLogoutView(TokenBlacklistView):
    """
    Logs out the user by blacklisting the provided refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get("refresh")
            token_obj = RefreshToken(token)
            token_obj.blacklist()
            return Response({"detail": "Token blacklisted successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid or missing token."}, status=status.HTTP_400_BAD_REQUEST)

class CategoryListCreate(generics.ListCreateAPIView):
    """
    Lists all categories and allows creation of a new category.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BlogPostListCreate(generics.ListCreateAPIView):
    """
    Lists all blog posts and allows creation of a new blog post.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BlogPostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates, or deletes a blog post.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Consider adding permission class to restrict update/delete to post authors only
    # def get_permissions(self):
    #     if self.request.method in ['PUT', 'PATCH', 'DELETE']:
    #         self.permission_classes = [IsAuthorOrReadOnly]
    #     return super().get_permissions()

class CommentListCreate(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post__id=post_id)
        return queryset

    def perform_create(self, serializer):
        # Ensure 'post' is passed correctly when creating a new comment
        post_id = self.request.data.get('post')
        if not post_id:
            raise ValidationError("Post ID is required to create a comment.")
        
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            raise ValidationError("The specified post does not exist.")

        user = self.request.user
        if Comment.objects.filter(post=post, author=user).exists():
            raise ValidationError("You have already commented on this post.")
        
        serializer.save(author=user, post=post)


class UserRegistrationView(generics.CreateAPIView):
    """
    Registers a new user.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class UserLoginView(generics.GenericAPIView):
    """
    Logs in a user and returns JWT tokens.
    """
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
