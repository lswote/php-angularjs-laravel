<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel{

	/**
	 * The Artisan commands provided by your application.
	 *
	 * @var array
	 */
	protected $commands = ['\App\Console\Commands\ChallengeExpirations', '\App\Console\Commands\ChallengeSummaries'];

	/**
	 * Define the application's command schedule.
	 *
	 * @param  \Illuminate\Console\Scheduling\Schedule $schedule
	 *
	 * @return void
	 */
	protected function schedule(Schedule $schedule){

		$schedule->command('CheckChallengeDeadlines:expirations')->dailyAt('04:00')->timezone('America/New_York');
		$schedule->command('CheckChallengeDeadlines:summaries', [3])->weekly()->mondays()->at('04:30')->timezone('America/New_York');
		$schedule->command('CheckChallengeDeadlines:summaries', [4])->weekly()->thursdays()->at('04:30')->timezone('America/New_York');

	}

}