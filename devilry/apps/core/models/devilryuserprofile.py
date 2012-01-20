from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save


class DevilryUserProfile(models.Model):
    """ User profile extending django.contrib.auth.models.User.

    Ment to be used as a Django _user profile_ (AUTH_PROFILE_MODULE).

    .. attribute:: full_name

        Django splits names into first_name and last_name. They are only 30 chars each.
        Read about why this is not a good idea here:
            http://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/

        Since we require support for _any_ name, we use our own full_name
        field, and ignore the one in Django.
    """
    user = models.OneToOneField(User) # This field is required, and it must be named ``user`` (because the model is used as a AUTH_PROFILE_MODULE)
    full_name = models.CharField(max_length=300, blank=True, null=True)

    class Meta:
        app_label = 'core'


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        DevilryUserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
