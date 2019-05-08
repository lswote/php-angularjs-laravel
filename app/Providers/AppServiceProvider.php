<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider{

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot(){

		Relation::morphMap(array(
			'singles' => 'App\Models\User',
			'doubles' => 'App\Models\Pair'
		));

	}

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register(){

		$this->app->bind('App\Interfaces\TokenInterface', 'App\Repositories\TokenRepository');
		$this->app->bind('App\Interfaces\UserInterface', 'App\Repositories\UserRepository');
		$this->app->bind('App\Interfaces\EventInterface', 'App\Repositories\EventRepository');
		$this->app->bind('App\Interfaces\FacilityInterface', 'App\Repositories\FacilityRepository');
		$this->app->bind('App\Interfaces\LineInterface', 'App\Repositories\LineRepository');
		$this->app->bind('App\Interfaces\EmailInterface', 'App\Repositories\EmailRepository');
		$this->app->bind('App\Interfaces\ActivityInterface', 'App\Repositories\ActivityRepository');
        $this->app->bind('App\Interfaces\EventRuleInterface', 'App\Repositories\EventRuleRepository');
        $this->app->bind('App\Interfaces\LadderEventInterface', 'App\Repositories\LadderEventRepository');
        $this->app->bind('App\Interfaces\PasswordResetInterface', 'App\Repositories\PasswordResetRepository');
        $this->app->bind('App\Interfaces\EventTeamInterface', 'App\Repositories\EventTeamRepository');
		$this->app->bind('App\Interfaces\EventMatchInterface', 'App\Repositories\EventMatchRepository');
		$this->app->bind('App\Interfaces\ReportInterface', 'App\Repositories\ReportRepository');
		$this->app->bind('App\Interfaces\MultifacilityInterface', 'App\Repositories\MultifacilityRepository');
		$this->app->bind('App\Interfaces\EventToDoInterface', 'App\Repositories\EventToDoRepository');

	}

}