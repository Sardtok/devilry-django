from django.utils.translation import ugettext as _
from django.db import models

from exercise import Exercise

class Status(models.Model):
    """
    A status that can be set for an exercise (e.g. completed).

    .. attribute:: active

        Whether this status can currently be used for exercises.

    .. attribute:: percentage

        The percentage of points awarded for doing an exercise with this status.
    """

    class Meta:
        app_label = 'trix'
        verbose_name = _('Status')
        verbose_name_plural = _('Statuses')

    name = models.SlugField()
    active = models.BooleanField(default=True)
#    DecimalField requires a fix to the JSON serializer
#    percentage = models.DecimalField(max_digits=3, decimal_places=2)
    percentage = models.FloatField()
