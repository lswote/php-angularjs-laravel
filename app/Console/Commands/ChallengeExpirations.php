<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Interfaces\EventInterface;
use App\Interfaces\ReportInterface;

class ChallengeExpirations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'CheckChallengeDeadlines:expirations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check challenge deadlines expiring';

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

		$this->report->process_expirations($this->events->get(1, 'facility leader'), 0);

    }
}
