#![warn(clippy::all)]
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_LANGUAGE, CONTENT_TYPE};
use std::collections::HashMap;

mod dcuniverse_api;

//TODO this should be part of a config


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let ENGINE_KEY: String = String::from("BT7ssisxnLKV1x2U5pwm");
    let SEARCH_URL: String = String::from("https://search.dcuniverseinfinite.com/api/v1/public/engines/search.json");

    let mut default_headers = HeaderMap::new();
    default_headers.insert(
        ACCEPT,
        HeaderValue::from_static("application/json, text/plain, */*"),
    );
    default_headers.insert(ACCEPT_LANGUAGE, HeaderValue::from_static("en-US,en;q=0.9"));
    default_headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_static("application/json;charset=UTF-8"),
    );

    let client = reqwest::Client::builder()
        .default_headers(default_headers)
        .build()?;

    //this is how to get a series
    let mut h = HashMap::default();
    h.insert(String::from("comicseries"), String::from("first_released"));
    let body = dcuniverse_api::json_search::build_search_json_body(ENGINE_KEY.clone(), 1, 100, vec!(String::from("comicseries")), Option::from(h),None, None);
    let resp: dcuniverse_api::comic_structs::JSONSearchSeries  = client.post(SEARCH_URL.clone())
    .body(serde_json::to_string(&body)?)
    .send()
    .await?
    .json()
    .await?;
    println! {"{}", resp.record_count};
    //this is how to get a page of issues for a given series
    //this is how to get a series
    let mut h2: HashMap<String,String> = HashMap::default();
    h2.insert(String::from("book"), String::from("first_released"));
    let mut filters: HashMap<String,String> = HashMap::default();
    filters.insert(String::from("series_uuid"),String::from("d37830fe-e7ac-4eb6-80c7-eda31c7fc2fc"));

    let mut f2: HashMap<String,HashMap<String, String>> = HashMap::default();
    f2.insert(String::from("book"), filters);

    let body = dcuniverse_api::json_search::build_search_json_body(ENGINE_KEY.clone(), 1, 100, vec!(String::from("book")), Option::from(h2),None, Option::from(f2));
    let resp: dcuniverse_api::comic_structs::JSONSearchComic  = client.post(SEARCH_URL.clone())
    .body(serde_json::to_string(&body)?)
    .send()
    .await?
    .json().await?;
    // println!{"{}", resp.record_count};
    let resp = reqwest::get("https://httpbin.org/ip")
        .await?
        .json::<HashMap<String, String>>()
        .await?;
    println!("{:#?}", resp);
    Ok(())
}
