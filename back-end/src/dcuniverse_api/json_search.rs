use std::collections::HashMap;
use serde::Serialize;


#[derive(Serialize, Clone)]
pub struct SearchJSONBody {
    pub engine_key: String,
    pub page: i32,
    pub per_page: i32,
    document_types: Vec<String>,
    sort_field: HashMap<String, String>,
    sort_direction: HashMap<String, String>, 
    filters: HashMap<String,HashMap<String, String>>,
}



/*
defaults for 
filters: none, 
sort direction: document_types: asc
sort field: none
for now, please note one document type per query
*/
pub fn build_search_json_body(
    engine_key: String,
    page: i32,
    per_page: i32,
    document_types: Vec<String>,
    sort_field: Option<HashMap<String, String>>,
    sort_direction: Option<HashMap<String, String>>, 
    filters: Option< HashMap<String,HashMap<String, String>>>,
) -> SearchJSONBody {
    let mut s = SearchJSONBody {
        engine_key,
        page, 
        per_page,
        document_types,
        filters: filters.unwrap_or_default(),
        sort_field: sort_field.unwrap_or_default(),
        sort_direction: sort_direction.unwrap_or_default()
    };
    s.sort_direction.insert(s.document_types[0].clone(), String::from("asc"));
    return s;
}