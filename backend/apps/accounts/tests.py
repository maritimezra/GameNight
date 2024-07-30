from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


class UsersManagersTests(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="normal@user.com",
            password="foo",
        )
        self.assertEqual(user.email, "normal@user.com")
        self.assertEqual(
            user.username, ""
        )  # Assuming username defaults to empty string

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(
            email="super@user.com",
            password="foo",
        )
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertEqual(
            admin_user.username, ""
        )  # Assuming username defaults to empty string
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_str_representation(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="test@user.com",
            password="foo",
        )
        self.assertEqual(str(user), user.email)

    def test_create_user_missing_email(self):
        User = get_user_model()
        with self.assertRaises(ValueError) as cm:
            User.objects.create_user(email="", password="foo")
        self.assertEqual(str(cm.exception), _("The Email must be set"))

    def test_create_superuser_missing_staff_flag(self):
        User = get_user_model()
        with self.assertRaises(ValueError) as cm:
            User.objects.create_superuser(
                email="super@user.com", password="foo", is_staff=False
            )
        self.assertEqual(str(cm.exception), _("Superuser must have is_staff=True."))

    def test_create_superuser_missing_superuser_flag(self):
        User = get_user_model()
        with self.assertRaises(ValueError) as cm:
            User.objects.create_superuser(
                email="super@user.com", password="foo", is_superuser=False
            )
        self.assertEqual(str(cm.exception), _("Superuser must have is_superuser=True."))
