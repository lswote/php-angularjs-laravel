<?php

namespace App\Interfaces;

interface ReportInterface{

	/*
     * Get ladder summary report
     *
	 * @param	int		 $event_id				ID of event
	 * @param	int		 $user_id				ID of person receiving report
	 * @param	int		 $days					Number days to include in report
	 *
     * @return  boolean
     *
     */
    public function get_ladder_summary_report($event_id, $user_id, $days);

}