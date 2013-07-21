# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from jsonify.decorators import ajax_request
from models import *

def index(request):
    return TemplateResponse(request,'templates/index.html',{})

def update_food(request):
    return TemplateResponse(request, 'templates/update_menu.html')

@ajax_request
def json_data(request):
    from datetime import datetime, timedelta
    today = datetime.today()
    dow = datetime.weekday(today)
    startDate = today-timedelta(dow)
    thisWeek = [startDate + timedelta(x) for x in range(5)]
    c = {}
    us = request.GET.get('user')
    foods=[]
    date = request.GET.get('date')
    if request.GET.get('all_food'):
        for x in Food.objects.all():
            foods.append({"name":x.name, "description":x.description, "food_type":x.food_type,\
                "snowmen":x.get_snowmen, "puddles":x.get_puddles,\
                "options":{"gluten":x.gluten, "onions":x.onions, \
                "nuts":x.nuts, "vegetarian":x.vegetarian,\
                "dairy":x.dairy}})

        return {'foods': foods}
    elif us and date:
        users = User.objects.filter(ldap_name='zak').all()
        if users:
            u = users[0]
            c['week'] = []
            for day in thisWeek:
                print day
                mt = Menu.objects.filter(date=datetime.strftime(day,'%Y-%m-%d')).all()
                if mt:
                    menuToday = mt[0]
                    todaysMenu = {'date':datetime.strftime(day,'%Y-%m-%d')}
                    todaysMenu['comments'] = []
                    todaysMenu['foods'] = []
                    for comment in Comment.objects.filter(menu=menuToday).all():
                        theComments = {'user':comment.user.ldap_name, \
                                'comment':comment.comment}
                        theComments['snowmen'] = comment.get_snowmen
                        theComments['puddles'] = comment.get_puddles
                        todaysMenu['comments'].append(theComments)
                    for food in menuToday.foods.all():
                        foodDict = {}
                        foodDict['name'] = food.name
                        foodDict['description'] = food.description
                        foodDict['food_type'] = food.food_type
                        foodDict['gluten'] = food.gluten
                        foodDict['onions'] = food.onions
                        foodDict['vegetarian'] = food.vegetarian
                        foodDict['nuts'] = food.nuts
                        foodDict['dairy'] = food.dairy
                        foodDict['snowmen'] = food.get_snowmen
                        foodDict['puddles'] = food.get_puddles
                        todaysMenu['foods'].append(foodDict)

                    c['week'].append(todaysMenu)
            return {'week':c['week']}
        else:
            return {'week':''}
                    
    else:
        return c


