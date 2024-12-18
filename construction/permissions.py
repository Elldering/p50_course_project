from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
     Allows access only to admin users. Blocks all access for others, including read access.
     """

    def has_permission(self, request, view):
        return bool(request.user.is_authenticated)


