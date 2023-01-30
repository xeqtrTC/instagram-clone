from django.shortcuts import render
from base64 import urlsafe_b64decode, urlsafe_b64encode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from django.utils.http import urlencode
from urllib.parse import quote, quote_plus
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from .serializers import PostSerializer
from .serializers import FollowersSerializer
from .serializers import PostSecondSerializer
from .serializers import LikePostSerializer
from .serializers import PostCommentsSerializer
from .serializers import CommentsByUserSerializer
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from rest_framework.decorators import permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from .email import send_token_via_email
import jwt
from django.conf import settings
# Create your views here.
from .models import Users
from .models import Posts
from .models import UserFollowers
from .models import PostLikes
from .models import PostComments
import random
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from itertools import chain
# import pandas as pd

@method_decorator(csrf_protect, name='dispatch')
class SearchUsers(APIView):

    def get(self, request, format=None):
        AllUsers = Users.objects.all()
        userSerializer = CustomUserSerializer(AllUsers, many=True)
        dataToSend = []

        for i in userSerializer.data:
            dataToAppend = {
                'username': i['username']
            }
            dataToSend.append(dataToAppend)

        return Response(dataToSend)

@method_decorator(csrf_protect, name='dispatch')
class ViewCommentsOfPost(APIView):

    def get(self, request, id, format=None):
        print(id)
        dataList = PostComments.objects.filter(post_id_id = id)
        serializerOfData = CommentsByUserSerializer(dataList, many=True)

        dataToSend = []

        for i in serializerOfData.data:

            dataToBePrepared = {
                'id': i['id'],
                'post_id': i['post_id_id'],
                'comment': i['comment'],
                'username': i['user_id']['username'],
                'datetime': i['created_at']
            }
            dataToSend.append(dataToBePrepared)

        return Response(dataToSend)

@method_decorator(csrf_protect, name='dispatch')
class PostCommentToPost(APIView):
    
    parser_classes = [JSONParser]
    
    def post(self, request, format=None):

        data = request.data
        user = request.user
        serializer = PostCommentsSerializer(data=data)

        if serializer.is_valid():

            comment = data['comment']
            post_id = data['id']
            user_id = user.id


            createComment = PostComments(comment = comment, post_id_id = post_id, user_id_id = user_id)
            
            createComment.save()
            countNumbersOfComment = PostComments.objects.filter(post_id_id = post_id).count()
            updatePostTotalComments = Posts.objects.get(id = post_id)
            updatePostTotalComments.total_comments = countNumbersOfComment + 1
            updatePostTotalComments.save()
            

            return Response({'post_id': post_id}, status=200)
        else:
            print(serializer.error_messages)
            return Response(status=401)


@method_decorator(csrf_protect, name='dispatch')
class UnlikePost(APIView):
    parser_classes = [JSONParser]

    def post(self, request, format=None):

        data = request.data
        user = request.user
        post_id_id = data['id']
        whatPost = PostLikes.objects.get(post_id_id = post_id_id, user_id_id = user.id)
        whatPost.delete()
  
        return Response(status=200)


@method_decorator(csrf_protect, name='dispatch')
class LikePost(APIView):
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        data = request.data

        serializer = LikePostSerializer(data=data)

        if serializer.is_valid():

            user_id_id = request.user.id
            post_id_id = data['id']

            like = PostLikes(user_id_id = user_id_id, post_id_id = post_id_id )

            like.save()

            ats = PostLikes.objects.filter(post_id_id = post_id_id).count()


            atses = Posts.objects.get(id = post_id_id)
            atses.total_likes = ats + 1
            atses.save()

            

            return Response({'success': 'moze'})
        else:
            print(serializer.error_messages)
            return Response(status=401)
        


@method_decorator(csrf_protect, name='dispatch')
class PostOfFollowedUsers(APIView):

    def get(self, request, format=None):
        user = request.user
        FollowedUsers = UserFollowers.objects.filter(user_id_id = user.id)
        followedUsersSerializer = FollowersSerializer(FollowedUsers, many=True)
        arrayToSend = []

        if UserFollowers.objects.filter(user_id_id = user.id).exists():
            for entry in followedUsersSerializer.data:
             
                letasd = entry['follower_id_id']
        
                posts = Posts.objects.filter(user_id_id = letasd)
                postsas = PostSecondSerializer(posts, many=True)
                asesaksks = PostLikes.objects.filter(user_id_id = user.id)
                postlikesarray = LikePostSerializer(asesaksks, many=True)

                serializerData = postsas.data

                for i in serializerData:
                    arrayToAppend =  {
                        'id': i['id'],
                        'username': i['user_id']['username'],
                        'idwhoposted': i['user_id']['id'],
                        'photo': i['photo'],
                        'liked_by': i['liked_by'],
                        'total_comments': i['total_comments'],
                        'liked': False,
                        'likedWho': {},
                        'datetime': i['created_at']
                    }
                    # ease = i['liked_by'][0]
                    for a in i['liked_by']:

                        if a == user.id:
                            arrayToAppend['liked'] = True
                        testas = Users.objects.filter(id = a)
                        serializerAh = CustomUserSerializer(testas, many=True)
                        for e in serializerAh.data:
                            ahs = e['username']

                        arrayToAppend['likedWho'] = {
                            ahs
                        }
                    


                
                    

                    arrayToSend.append(arrayToAppend)

            
                return Response(arrayToSend)

        else:
            return Response(arrayToSend)
        

@method_decorator(csrf_protect, name='dispatch')
class UnFollowAnotherUser(APIView):

    parser_classes = [JSONParser]

    def post(self, request, format=None):
        user = request.user
        data = request.data
        username = data['username']
        idOfUnFollowedUser = Users.objects.get(username = username)
        serializerOfCurrentUser = CustomUserSerializer(idOfUnFollowedUser, many=False)
        follower_id = serializerOfCurrentUser.data['id']
        tableOfDatabase = UserFollowers.objects.get(follower_id_id=follower_id, user_id_id = user.id)
        # tableOfDatabase.delete()
        followSerializer = FollowersSerializer(tableOfDatabase, many=False)
        tableOfDatabase.delete()
        return Response({'mozda'})


@method_decorator(csrf_protect, name='dispatch')
class FollowAnotherUser(APIView):

    parser_classes = [JSONParser]

    def post(self, request, format=None):
        user = request.user
        data = request.data
        idOfFollowedUser = Users.objects.get(username = data['username'])
        serializer = FollowersSerializer(data=data)

        if serializer.is_valid():
            
            userFollow = UserFollowers(follower_id_id=idOfFollowedUser.id, user_id_id = user.id)
            userFollow.save()
            return Response({'success': True}, status=200)

        else:
            return Response(serializer._errors)


@method_decorator(csrf_protect, name='dispatch')
class SeePublicProfile(APIView):
    parser_classes = [JSONParser]


    def get(self, request, username,format=None):
        userInfo =  request.user
        user = Users.objects.get(username=username)
        userSerializer = CustomUserSerializer(user, many=False)
        posts = Posts.objects.filter(user_id_id=user)
        postSerializer = PostSecondSerializer(posts, many=True)
        idOfUser = userSerializer['id'].value
        countFollowers = UserFollowers.objects.filter(follower_id_id = idOfUser).count()
        countFollowing = UserFollowers.objects.filter(user_id_id = idOfUser).count()
      
        
        try:
            userFollow = UserFollowers.objects.get(user_id_id = request.user.id)
            serializerFollower = FollowersSerializer(userFollow)

            testras = serializerFollower.data['follower_id_id']
            aeas = userSerializer.data['id'] 
            isUserFollowed = testras == aeas
        except UserFollowers.DoesNotExist:
            isUserFollowed = False

       
        lets = {
            "username": userSerializer.data['username'],
            'isUserFollowed': isUserFollowed,
            'countFollowers': countFollowers,
            'countFollowing': countFollowing,
            'isAuth': True
        } 
        letsSecond = {
            "username": userSerializer.data['username'],
            'isUserFollowed': isUserFollowed,
            'countFollowers': countFollowers,
            'countFollowing': countFollowing,
            'isAuth': False
        } 
        
        arrayToSend = []
        for i in postSerializer.data:
                arrayToAppend =  {
                    'id': i['id'],
                    'username': i['user_id']['username'],
                    'idwhoposted': i['user_id']['id'],
                    'photo': i['photo'],
                    'liked_by': i['liked_by'],
                    'total_comments': i['total_comments'],
                    'liked': False,
                    'likedWho': {},
                    'datetime': i['created_at']
                }
                # ease = i['liked_by'][0]
                for a in i['liked_by']:

                    if a == userInfo.id:
                        arrayToAppend['liked'] = True
                    testas = Users.objects.filter(id = a)
                    serializerAh = CustomUserSerializer(testas, many=True)
                    for e in serializerAh.data:
                      ahs = e['username']

                    arrayToAppend['likedWho'] = {
                        ahs
                    }
                  


               
                

                arrayToSend.append(arrayToAppend)
        # combinedSecond = postSerializer.data | userSerializer.data
        if username == userInfo.username:
            return Response({
            "posts": arrayToSend,
            "info": lets
        }, status=200)
        else:
            return Response({
            "posts":arrayToSend,
            "info": letsSecond
        }, status=200)



@method_decorator(csrf_protect, name='dispatch')
class ViewWhoAmI(APIView):

    def get(self, request, format=None):

        user = request.user
        print(user.username)
        print(user)

        if user.is_authenticated:
            return Response({
                'isAuth': user.is_authenticated,
                'username': user.username
            })
        else:
            return Response(status=401)

        


@method_decorator(csrf_protect, name='dispatch')
class ViewPostOfUser(APIView):

    def get(self, request, format=None):
        posts = Posts.objects.filter(user_id_id=request.user.id)
        serializer = PostSerializer(posts, many=True)
        
        return Response(serializer.data, status=201)
@method_decorator(csrf_protect, name='dispatch')
class AddPost(APIView):
    parser_classes = [FormParser, MultiPartParser]


    def post(self, request, format=None):
        data = request.data
        print(data)
        photo = data['photo']
        total_likes = data['total_likes']
        print(request.FILES)
        total_comments = data['total_comments']
        serializer = PostSerializer(data=data)
        
        if serializer.is_valid():
            user = request.user
            
            post = Posts(user_id_id=user.id, photo=photo, total_comments=total_comments)
            post.save()
            return Response({'success'}, status=200)
        else:
            print(serializer._errors)
            return Response({'ne moze'}, status=401)
    
    

class VerifyEmail(APIView):

    permission_classes = [AllowAny]

    def get(self, request, token, format=None):
        
        # token = request.data
        tokenwithoutb = token[1:]
        
        try:
            uncoded = urlsafe_b64decode(tokenwithoutb).decode('UTF-8')
            tokendecoded = jwt.decode(uncoded, settings.SECRET_KEY, algorithms='HS512')   
            emaildecoded = tokendecoded['email']
            seewhoisthis = Users.objects.get(email=emaildecoded)
            seewhoisthis.is_verificated = True
            seewhoisthis.save()
            serializer = CustomUserSerializer(seewhoisthis, many=False)
            return Response(status=200)

        except:
            print("An exception occurred")
            return Response(status=403)
        
        
        
        
        # uncoded = urlsafe_b64decode(testTest).decode('UTF-8')
        # tokendecoded = jwt.decode(uncoded, settings.SECRET_KEY, algorithms='HS512')    
  







        # datatest = pd.read_csv(token)
        # print(datatest.head())
        # print(testTest)
        
        # print(tokendecoded)
        # print(uncoded)


# class LoginUser(APIView):

#     def post(self, request, format=None):
#         data = request.data

#         username = data['username']
#         password = password['password']

#         user = authenticate(username=username, password=password)
#         print(user)



@permission_classes([AllowAny])
class RegistedUser(APIView):
    
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        
        permission_classes = [AllowAny]
        num = range(0, 9)
        codeforotp = random.sample(num, 6)
        withoutbrackets = str(codeforotp).strip('[]')
        withoutdots = str(withoutbrackets).replace(',', '')
        

        data = request.data
        serializer = CustomUserSerializer(data=data)

        if serializer.is_valid():
            username = serializer.data['username']
            email = serializer.data['email']
            password = serializer.data['password']
            hashedPassword = make_password(password)


            
            # tokenjwt = jwt.encode({
            # 'email': email,
            # }, settings.SECRET_KEY, algorithm='HS512')
            # encodedtoken = quote_plus(tokenjwt, safe='')
            # deocde43 = urlsafe_b64encode(str(tokenjwt).encode('utf-8'))
            # uncoded = urlsafe_b64decode(deocde43).decode('utf-8')
            # tokendecoded = jwt.decode(uncoded, settings.SECRET_KEY, algorithms='HS512')

            # print('token', tokenjwt)
            # print('ovo je encoded', deocde43)
            # print('ovo je decoded', uncoded)
            # print('ovo je decodedtoken', tokendecoded)

          
            last_login = '2013'
            codes = random.sample(num, 6)
            code_otp = withoutdots.replace(" ", "")
            

            user = Users(username=username, email=email, password=hashedPassword, code_otp=code_otp )
            send_token_via_email(email)

            user.save()


           

        else:
            print(serializer._errors)
            return Response(serializer.errors.values(), status=409)

        return Response(status=200)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        return Response({'success': 'csrf cookie set'})
@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]


    def post(self, request, format=None):
        data = self.request.data
        
        username = data['username']
        password = data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            seewhoisthis = Users.objects.get(username = username)
            isverificated = seewhoisthis.is_verificated
            if isverificated == False:
                return Response({'message': 'You need to verificate your account'}, status=401)
            elif isverificated == True:
                login(request, user)
                print('mozda')
                return Response({'message': 'works'}, status=200)
           
        else:
            return Response({'message': 'Wrong username or password, try again'}, status=401)

@method_decorator(csrf_protect, name='dispatch')
class LogoutView(APIView):

    def post(self, request, format=None):

        try:
            logout(request)
            return Response(status=201)
        except:
            return Response(status=401)

       
            