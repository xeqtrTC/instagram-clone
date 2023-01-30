from django.contrib import admin
from .models import Posts
from .models import Users
from .models import UserFollowers
from .models import UserFeeds
from .models import PostLikes
from .models import PostComments
# Register your models here.

admin.site.register(Posts)
admin.site.register(Users)
admin.site.register(UserFollowers)
admin.site.register(UserFeeds)
admin.site.register(PostLikes)
admin.site.register(PostComments)