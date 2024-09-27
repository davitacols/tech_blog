from rest_framework import serializers
from .models import BlogPost, Category, Comment
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    # Optionally include the author's username for the comment
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Ensure content is not empty
        if not attrs.get('content'):
            raise serializers.ValidationError("Comment content cannot be empty.")
        return attrs


class BlogPostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)  # Nested serializer for comments

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'category', 'comments', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Ensure title is unique
        if BlogPost.objects.filter(title=attrs.get('title')).exists():
            raise serializers.ValidationError({"title": "A post with this title already exists."})
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user  # Set the author to the logged-in user
        return super().create(validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user is None:
            raise serializers.ValidationError("Invalid username or password.")
        attrs['user'] = user
        return attrs
