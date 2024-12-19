import os
from io import BytesIO
from django.apps import apps
from django.contrib.auth import logout, authenticate, login, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.db.models import Count
from django.db.models.functions import ExtractMonth
from django.utils import timezone
from subprocess import run, CalledProcessError
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from construction.permissions import IsAdminUser
import logging
from datetime import datetime
from praktica_2024_september.settings import BACKUP_DIR
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.mixins import PermissionRequiredMixin
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
import base64
import matplotlib.pyplot as plt
from django.contrib import messages
from .forms import CustomLoginForm
from rest_framework import viewsets, status
from .serializers import *
from rest_framework.filters import OrderingFilter, SearchFilter


class AdminRequiredMixin(PermissionRequiredMixin):
    permission_required = 'is_admin'


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == "POST":
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Добро пожаловать, {user.username}!")
                return redirect('dashboard')
            else:
                messages.error(request, "Неверное имя пользователя или пароль.")
        else:
            messages.error(request, "Ошибка при вводе данных.")
    else:
        form = CustomLoginForm()

    return render(request, 'login.html', {'form': form})


@login_required
def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser, ]

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class ResourceTypeViewSet(viewsets.ModelViewSet):
    queryset = ResourceType.objects.all()
    serializer_class = ResourceTypeSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']

    def perform_create(self, serializer):
        serializer.save(status="В процессе")


class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class MaterialDistributionViewSet(viewsets.ModelViewSet):
    queryset = MaterialDistribution.objects.all()
    serializer_class = MaterialDistributionSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class FinanceViewSet(viewsets.ModelViewSet):
    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class ActionLogViewSet(viewsets.ModelViewSet):
    queryset = ActionLog.objects.all().order_by('-action_date')
    serializer_class = ActionLogSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


class TaskReportViewSet(viewsets.ModelViewSet):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer
    permission_classes = (IsAdminUser,)

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = '__all__'
    ordering_fields = '__all__'
    search_fields = ['id']


@api_view(['GET'])
def get_model_fields(request, model_name):
    try:
        # Получаем модель по имени
        model = apps.get_model('construction', model_name)
        fields = [field.name for field in model._meta.fields]
        return Response({'fields': fields}, status=status.HTTP_200_OK)
    except LookupError:
        return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.accessToken),
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserDetailView(APIView):
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })


class LoginAPIView(APIView):

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},

                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Неверные данные'},

                            status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'username': user.username
        })
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Добавить его в чёрный список
        except Exception as e:
            return Response({'error': 'Неверный Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    name = request.data.get('first_name')
    surname = request.data.get('last_name')
    role_name = request.data.get('role')  # Получаем имя роли из данных запроса

    if username and password:
        try:
            # Получаем объект роли, если она существует
            role = Role.objects.filter(id=role_name).first()
            if not role:
                return Response({"message": "Указанная роль не существует"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(
                username=username,
                password=make_password(password),
                role=role,  # Связываем пользователя с объектом роли
                last_name=surname,
                first_name=name
            )

            return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Необходимо указать username и password"}, status=status.HTTP_400_BAD_REQUEST)


class DatabaseLogHandler(logging.Handler):
    def emit(self, record):
        try:
            # Сохраняем лог в базу данных
            ActionLog.objects.create(
                level=record.levelname,
                action=record.getMessage(),
            )
        except Exception as e:
            # Если произошла ошибка, выводим ее в консоль
            print(f"Failed to save log to database: {e}")


logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['GET'])
def user_statistics(request):
    # Статистика по ролям пользователей
    role_counts = User.objects.values('role').annotate(count=Count('id'))

    monthly_counts = (
        User.objects.extra({'month': "to_char(date_joined, 'YYYY-MM')"})
        .values('month')
        .annotate(Count('id'))
        .order_by('month')
    )

    data = {
        'role_statistics': list(role_counts),  # Статистика по ролям
        'monthly_statistics': list(monthly_counts),  # Статистика по месяцам
    }
    return JsonResponse(data)


def get_logs(request):
    logs = []
    with open('logs/django.log', 'r') as file:
        logs = file.readlines()[-7:]
    return JsonResponse({'logs': logs})


@api_view(['GET'])
def get_user_role(request):
    user = get_object_or_404(User, id=request.user.id)

    if hasattr(user, 'role') and user.role is not None:
        role_name = user.role.name
    else:
        role_name = "Роль не назначена"

    return JsonResponse({"role": role_name})


def generate_base64_image(fig):
    """Генерирует base64-представление изображения matplotlib."""
    buffer = BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    return image_base64


def user_statistics(request):
    role_data = User.objects.values('role__name').annotate(count=Count('id'))
    total_users = User.objects.count()

    if total_users == 0:
        return JsonResponse({
            'role_chart': None,
            'monthly_chart': None,
            'statistics': {
                'total_users': 0,
                'role_distribution': [],
                'total_new_users': 0,
            }
        })

    roles = [str(entry['role__name']) if entry['role__name'] is not None else "Неизвестно" for entry in role_data]
    role_counts = [entry['count'] for entry in role_data]

    role_percentages = [
        {"role": role, "percentage": round((count / total_users) * 100, 2)}
        for role, count in zip(roles, role_counts)
    ]

    fig1, ax1 = plt.subplots()
    ax1.bar(roles, role_counts, color='skyblue')
    ax1.set_title('Количество пользователей по ролям')
    ax1.set_xlabel('Роль')
    ax1.set_ylabel('Количество')
    role_chart_base64 = generate_base64_image(fig1)
    plt.close(fig1)

    current_year = timezone.now().year
    monthly_data = (
        User.objects
        .filter(date_joined__year=current_year)
        .annotate(month=ExtractMonth('date_joined'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    months = [entry['month'] for entry in monthly_data]
    counts = [entry['count'] for entry in monthly_data]
    total_new_users = sum(counts)


    fig2, ax2 = plt.subplots()
    ax2.plot(months, counts, marker='o', linestyle='-', color='orange')
    ax2.set_title('Новые пользователи по месяцам')
    ax2.set_xlabel('Месяц')
    ax2.set_ylabel('Количество')
    ax2.set_xticks(range(1, 13))
    ax2.set_xticklabels([
        'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ], rotation=45)
    monthly_chart_base64 = generate_base64_image(fig2)
    plt.close(fig2)

    return JsonResponse({
        'role_chart': role_chart_base64,
        'monthly_chart': monthly_chart_base64,
        'statistics': {
            'total_users': total_users,
            'role_distribution': role_percentages,
            'total_new_users': total_new_users,
        }
    })


def backup_database(request):
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"backup_{timestamp}.dump"
        command = [
            "python",
            "manage.py",
            "dbbackup",
            "--output-filename",
            os.path.join(BACKUP_DIR, output_filename),
        ]
        run(command, check=True)

        return JsonResponse({
            "success": True,
            "message": "Резервное копирование успешно",
            "file": output_filename,
        })
    except CalledProcessError as e:
        return JsonResponse({
            "success": False,
            "message": f"Ошибка выполнения команды: {str(e)}",
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": f"Неизвестная ошибка: {str(e)}",
        })
