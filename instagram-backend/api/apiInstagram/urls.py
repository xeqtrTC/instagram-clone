from django.urls import path
from . import views

urlpatterns = [
    path('adduser', views.RegistedUser.as_view(), name='adduser'),
    path('csrftoken', views.GetCSRFToken.as_view(), name='csrftoken'),
    path('loginuser', views.LoginView.as_view(), name='loginuser'),
    path('addpost', views.AddPost.as_view(), name='addpost'),
    path('verifyEmail/<str:token>', views.VerifyEmail.as_view(), name='verifyEmail'),
    path('postsofuser', views.ViewPostOfUser.as_view(), name='dispatch'),
    path('whoami', views.ViewWhoAmI.as_view(), name='whoami'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('publicprofile/<str:username>', views.SeePublicProfile.as_view(), name='publicprofile'),
    path('followuser', views.FollowAnotherUser.as_view(), name='followuser'),
    path('unfollowuser', views.UnFollowAnotherUser.as_view(), name='unfollow'),
    path('postsofFollowedUser', views.PostOfFollowedUsers.as_view(), name='PostOfFollowedUsers'),
    path('likepost', views.LikePost.as_view(), name='likepost'),
    path('unlikepost', views.UnlikePost.as_view(), name='unlikepost'),
    path('commentpost', views.PostCommentToPost.as_view(), name='commentpost'),
    path('commentsOfPost/<int:id>', views.ViewCommentsOfPost.as_view(), name='ViewCommentsOfPost'),
    path('searchusers', views.SearchUsers.as_view(), name='SearchUsers')
]