from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from menu import views
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'snowmenu.views.home', name='home'),
    # url(r'^snowmenu/', include('snowmenu.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='index'),
    url(r'^json_data', views.json_data, name='json_data'),
    url(r'^update_menu', views.update_menu, name='update_menu'),
    url(r'^food_post', views.food_post, name='food_post')
)
