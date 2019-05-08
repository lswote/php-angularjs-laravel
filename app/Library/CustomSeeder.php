<?php

namespace App\Library;

use Illuminate\Support\Facades\DB;

class CustomSeeder{

	private $calling_class, $table_name;

	public function __construct($calling_class, $table_name = null){

		$this->calling_class = $calling_class;
		$this->table_name = $table_name;

	}

	// Convert camel case class name to one using underscrolls
	private function convert_camel_case_to_underscroll(){

		return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $this->calling_class));

	}

	// Get the DB table name based on the calling class
	private function get_table_name(){

		$converted_current_class_name = $this->convert_camel_case_to_underscroll();
		$last_underscroll_index = intval(strrpos($converted_current_class_name, '_'));
		return substr($converted_current_class_name, 0, $last_underscroll_index);

	}

	// Check to see if a record already exists in the DB.  If not, insert it
	public function custom_insert($row, $value_match = true){

		$table_name = $this->table_name === null ? $this->get_table_name() : $this->table_name;
		$table_object = DB::table($table_name);
		foreach($row as $key => $value){
			if($value_match === false){
				if($key != 'value'){
					$table_object->where($key, '=', $value);
				}
			}
			else{
				$table_object->where($key, '=', $value);
			}
		}
		if(!$table_object->get()){
			DB::table($table_name)->insert($row);
		};

	}

}