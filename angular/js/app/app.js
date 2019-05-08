var teamsRIt = angular.module('teamsRIt', ['ngRoute', 'pickadate']);

teamsRIt.run(function($route, $rootScope, $location, $templateCache){
    // We use this to modify the URL without reloading the current controller
    var original = $location.path;
    $location.path = function(path, reload){
        if(reload === false){
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function(){
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
    // Dynamically change the page's tab title
    $rootScope.$on('$routeChangeSuccess', function(event, current){
        $rootScope.title = current.$$route ? current.$$route.title : 'Home';
    });
    // Disable template caching
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});

// URL routing setup
teamsRIt.config(function($locationProvider, $routeProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when('/register', {
            title: 'Register'
        })
        .when('/forgot-password', {
            title: 'Forgot Password'
        })
        .when('/reset-password', {
            title: 'Reset Password'
        })
        .when('/rsvp', {
            title: 'Confirm RSVP'
        })
        .when('/admin', {
            title: 'Admin',
            templateUrl: '/pages/admin.html'
        })
        .when('/event/:id?', {
            title: 'Event Setup',
            templateUrl: '/pages/event.html'
        })
        .when('/event/:id?/lines', {
            title: 'Event Setup',
            templateUrl: '/pages/event-lines.html'
        })
        .when('/event/:id?/availability', {
            title: 'Team Availability',
            templateUrl: '/pages/event-teams-availability.html'
        })
		.when('/event/:id?/substitutes', {
            title: 'Sub Availability',
            templateUrl: '/pages/event-subs-availability.html'
        })
        .when('/event/:id?/teams', {
            title: 'Event Groups And Teams',
            templateUrl: '/pages/event-teams.html'
        })
        .when('/event/:id?/to-dos', {
            title: 'Event ToDos',
            templateUrl: '/pages/event-to-dos.html'
        })
        .when('/event/:id?/leaders', {
            title: 'Event Leaders',
            templateUrl: '/pages/event-leaders.html'
        })
        .when('/event/:id?/signups', {
            title: 'Event Signup Statuses',
            templateUrl: '/pages/event-signups.html'
        })
        .when('/event/:id?/standings', {
            title: 'Event Standings',
            templateUrl: '/pages/event-standings.html'
        })
        .when('/event/:id?/lineups', {
            title: 'Event Lineups',
            templateUrl: '/pages/event-lineups.html'
        })
		.when('/event/:id?/pairings', {
            title: 'Event Pairings',
            templateUrl: '/pages/event-pairings.html'
        })
		.when('/event/:id?/playoff', {
            title: 'Event Playoffs',
            templateUrl: '/pages/event-playoff.html'
        })
        .when('/past-events', {
            title: 'Past Events',
            templateUrl: '/pages/past-events.html'
        })
        .when('/about-events', {
            title: 'About Events',
            templateUrl: '/pages/about-events.html'
        })
		.when('/event-flows', {
		  title: 'Event Flows',
		  templateUrl: '/pages/event-flows.html'
		})
        .when('/email', {
            title: 'Send E-Mails',
            templateUrl: '/pages/email.html'
        })
        .when('/facility/:id?/activities', {
            title: 'Facility Activities',
            templateUrl: '/pages/facility-activities.html'
        })
        .otherwise({
            title: 'Dashboard',
            templateUrl: '/pages/dashboard.html'
        });
});

// For each http request, send API token in header
teamsRIt.factory('httpRequestInterceptor', function($rootScope){
    return {
        request: function(config){
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            if($rootScope.apiToken){
                config.headers['API-Token'] = $rootScope.apiToken;
            }
            return config;
        }
    }
});
teamsRIt.config(function($httpProvider){
    $httpProvider.interceptors.push('httpRequestInterceptor');
});

// Define our constants
if(typeof env === 'undefined' || env === 'local'){
    teamsRIt.constant('internalConstants', {
        baseURL: 'http://localteamsritapi/',
        homepageURL: 'http://localteamsrithomepage/',
        awsBucket: 'teams-r-it-images',
        awsKey: 'AKIAI5RAQUAY4LSYRNJA',
        awsSecret: '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'
    });
}
else if(env === 'web'){
	teamsRIt.constant('internalConstants', {
		baseURL: 'http://69.65.87.118/public/',
		homepageURL: 'http://69.65.87.118/',
		awsBucket: 'teams-r-it-images',
		awsKey: 'AKIAI5RAQUAY4LSYRNJA',
		awsSecret: '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'
	});
}
else if(env === 'dev'){
	teamsRIt.constant('internalConstants', {
        baseURL: 'https://devapi.teamsrit.com/',
        homepageURL: 'https://teamsrit.com/',
        awsBucket: 'teams-r-it-images',
        awsKey: 'AKIAI5RAQUAY4LSYRNJA',
        awsSecret: '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'
    });
}
else if(env === 'prod'){
    teamsRIt.constant('internalConstants', {
        baseURL: 'https://api.teamsrit.com/',
        homepageURL: 'https://teamsrit.com/',
        awsBucket: 'teams-r-it-images',
        awsKey: 'AKIAI5RAQUAY4LSYRNJA',
        awsSecret: '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'
    });
}