"""
URL configuration for praktica_2024_september project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django_spaghetti.views import plate

from construction.views import *
from django.conf.urls import static
from django.contrib.auth.decorators import user_passes_test


# Проверка на роль администратора
def is_admin(user):
    return user.is_authenticated


from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.views import *
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

router = DefaultRouter()
router.register(r'roles', RoleViewSet)
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'resource_types', ResourceTypeViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'stages', StageViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'material_distributions', MaterialDistributionViewSet)
router.register(r'finances', FinanceViewSet)
router.register(r'action_logs', ActionLogViewSet)
router.register(r'task_reports', TaskReportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_user_role/', get_user_role),
    path('', include(router.urls)),
    # path('', home, name='home'),
    # path('admin_view/', include('construction.routing_admin')),
    # path('employeer_view/', include('construction.routing_employeer')),
    # path('stage_manager_view/', include('construction.routing_stage_manager')),

    path('login2/', login_view, name='login2'),
    path('logout2/', logout_view, name='logout2'),
    path('dashboard/', dashboard_view, name='dashboard'),  # Страница после входа
    path('api/model-fields/<str:model_name>/', get_model_fields, name='get_model_fields'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('login/', LoginView.as_view(), name='login'),
    path('user/me/', UserDetailView.as_view(), name='user-detail'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    path('api/register/', register, name='register'),

    path('api/logs/', get_logs, name='get_logs'),

    path('api/user-statistics/', user_statistics, name='user-statistics'),

    path("backup/", backup_database, name="backup_database"),

    path('spaghetti/', plate, name='spaghetti'),

    # path('api/logs/', get_logs, name='get_logs'),

]
