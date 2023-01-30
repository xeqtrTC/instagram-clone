from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, AbstractUser, UserManager
# Create your models here.
import uuid
from django.utils.translation import gettext_lazy as _

def upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

class MyUserManager(BaseUserManager):
    def create_user(self, username, date_of_birth, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not username:
            raise ValueError('Users must have an email address')

        user = self.model(
            username=self.normalize_email(username),
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, date_of_birth, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            username,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=255)
    email = models.EmailField(unique=True)
    date = models.DateTimeField(auto_now_add=True)
    code_otp = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)
    is_active=  models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateField(auto_now_add=True)
    is_verificated = models.BooleanField(default=False)

    objects = MyUserManager()
    USERNAME_FIELD = 'username'


    def __str__(self):
        return str(self.username)
    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return True

class UserFollowers(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(Users, related_name='user_First', on_delete=models.CASCADE)
    follower_id = models.ForeignKey(Users, related_name='user_Second', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Posts(models.Model):
    id = models.AutoField(primary_key=True)
    user_id  = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='user_Third')
    # user_id = models.ManyToManyField('Users', related_name='user', blank=True)
    photo = models.ImageField(_('Image'), upload_to=upload_to, default='posts/default.jpg')
    liked_by = models.ManyToManyField('Users', through='PostLikes')
    # username = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='usernameOfUser')
    total_comments = models.CharField(max_length=1000)
    total_likes = models.CharField(max_length=1000, default=0),
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

class UserFeeds(models.Model):
    id = models.AutoField(primary_key=True, )
    post_id_id = models.ForeignKey(Posts, related_name='post_First', on_delete=models.CASCADE, default='55')
    user_id = models.ForeignKey(Users, related_name='user_Fourth', on_delete=models.CASCADE)
    seen = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

class PostLikes(models.Model):
    id = models.AutoField(primary_key=True)
    post_id = models.ForeignKey(Posts, related_name='post_Fifth', on_delete=models.CASCADE)
    user_id = models.ForeignKey(Users, related_name='user_Fifth', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class PostComments(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(Users, related_name='user_Sixth', on_delete=models.CASCADE)
    post_id = models.ForeignKey(Posts, related_name='post_Third', on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
