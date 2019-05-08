<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Interfaces\EventInterface;
use App\Interfaces\ReportInterface;

class ChallengeSummaries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'CheckChallengeDeadlines:summaries {days?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check challenge deadline summaries';

    /**
     * Create a new command instance.
     *
     * @return void
     */
	public function __construct(EventInterface $events, ReportInterface $report){

        parent::__construct();

        $this->events = $events;
        $this->report = $report;
	}

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(){

		$days = $this->argument('days');
		if(!$days){
			$days = 1;
		}
		$this->report->process_summary_reports($this->events->get(1, 'facility leader'), 0, $days);

    }
}
