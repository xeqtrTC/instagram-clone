from rest_framework.serializers import ModelSerializer, ImageField, HyperlinkedModelSerializer ,SerializerMethodField, ReadOnlyField, PrimaryKeyRelatedField
from .models import Users
from .models import Posts
from .models import UserFollowers
from .models import PostLikes
from .models import PostComments

class Base64ImageField(ImageField):

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class CustomUserSerializer(ModelSerializer):

    

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'date', 'password', 'last_login', 'is_verificated']

        def create(self, validated_data):
            users = Users.objects.create(
                username = validated_data['username'],
                email = validated_data['email'],
                password = validated_data['password'],
                last_login = validated_data['last_login'],
                code_otp = validated_data['code_otp']

            )
            users.save()
            return users

class PostSerializer(ModelSerializer):
    
    # photo = Base64ImageField(max_length=None, use_url=True)
    liked_by = PrimaryKeyRelatedField(
            many=True,
            queryset = Users.objects.all()
        )
    

    class Meta:
        model = Posts
        fields = ['photo',  'total_comments', 'total_likes', 'id', 'user_id_id', 'liked_by' ]
        

    
        # def create(self, validated_data):
        #     posts = Posts.objects.create(
        #         photo
        #     )
class LikePostSerializer(ModelSerializer):

    

    class Meta:
        model = PostLikes
        fields = ['post_id_id',]

        def create(self, validated_data):
            postlikes = PostLikes.objects.create(
                post_id_id = validated_data['post_id_id'],
            )
            postlikes.save()
            return postlikes

class PostSecondSerializer(HyperlinkedModelSerializer):
    
    user_id = CustomUserSerializer()
    liked_by = PrimaryKeyRelatedField(
            many=True,
            queryset = Users.objects.all()
        )
    
    class Meta:
        model = Posts
        fields = ['photo', 'total_comments', 'id','liked_by', 'user_id', 'created_at']




class FollowersSerializer(ModelSerializer):

    class Meta:
        model = UserFollowers
        fields = ['follower_id_id', "user_id_id"]


class PostCommentsSerializer(ModelSerializer):

    class Meta:
        model  = PostComments
        fields = ['comment', 'post_id_id', 'created_at', 'user_id_id']

        def create(self, validated_data):
            postcomments = PostComments.objects.create(
                comment = validated_data['comment'],
                post_id_id = validated_data['post_id_id_'],
                user_id_id = validated_data['user_id_id']
            )
            postcomments.save()

            return postcomments


class CommentsByUserSerializer(HyperlinkedModelSerializer):
    user_id = CustomUserSerializer()
    class Meta:
        model = PostComments
        fields = ['id', 'post_id_id', 'comment', 'user_id', 'created_at']
