#![warn(clippy::all)]
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_LANGUAGE, CONTENT_TYPE};
use std::collections::HashMap;
mod dcuniverse_api;

//TODO this should be part of a config

const engine_key: &str = "BT7ssisxnLKV1x2U5pwm";
const search_url: &str = "https://search.dcuniverseinfinite.com/api/v1/public/engines/search.json";

fn main() -> reqwest::Result<()>{


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

    // let client = reqwest::Client::builder()
    //     .default_headers(default_headers.clone())
    //     .build()?;

    // //this is how to get a series
    // let mut h = HashMap::default();
    // h.insert(String::from("comicseries"), String::from("first_released"));
    // let body = dcuniverse_api::json_search::build_search_json_body(String::from(engine_key), 1, 100, vec!(String::from("comicseries")), Option::from(h),None, None);
    // let _resp: dcuniverse_api::comic_structs::JSONSearchSeries  = client.post(String::from(search_url))
    // .body(serde_json::to_string(&body)?)
    // .send()
    // .await?
    // .json()
    // .await?;
    // println! {"{}", _resp.record_count};
    // //this is how to get a page of issues for a given series
    // //this is how to get a series
    // let mut h2: HashMap<String,String> = HashMap::default();
    // h2.insert(String::from("book"), String::from("first_released"));
    // let mut filters: HashMap<String,String> = HashMap::default();
    // filters.insert(String::from("series_uuid"),String::from("d37830fe-e7ac-4eb6-80c7-eda31c7fc2fc"));

    // let mut f2: HashMap<String,HashMap<String, String>> = HashMap::default();
    // f2.insert(String::from("book"), filters);

    // let body = dcuniverse_api::json_search::build_search_json_body(String::from(engine_key), 1, 100, vec!(String::from("book")), Option::from(h2),None, Option::from(f2));
    // let _resp: dcuniverse_api::comic_structs::JSONSearchComic  = client.post(String::from(search_url))
    // .body(serde_json::to_string(&body)?)
    // .send()
    // .await?
    // .json().await?;
    // // println!{"{}", resp.record_count};
    let bClient = reqwest::blocking::Client::builder().default_headers(default_headers.clone()).build()?;
    let iter : dcuniverse_api::web_api_iterator::WebAPIIterator<dcuniverse_api::comic_structs::Comic, dcuniverse_api::comic_structs::JSONSearchComic> =dcuniverse_api::web_api_iterator::WebAPIIterator::of(bClient, getComicSeries);
    for (j,i) in iter.enumerate() {

            println!("{:#?}", i);   
    }
    
    
    // let resp = reqwest::get("https://httpbin.org/ip")
    //     .await?
    //     .json::<HashMap<String, String>>()
    //     .await?;
    // println!("{:#?}", resp);
    Ok(())
}

fn getComicSeries(client: reqwest::blocking::Client, page: i32, per_page: i32) -> reqwest::Result<dcuniverse_api::comic_structs::JSONSearchComic> {
    let mut h2: HashMap<String,String> = HashMap::default();
    h2.insert(String::from("book"), String::from("first_released"));
    let mut filters: HashMap<String,String> = HashMap::default();
    filters.insert(String::from("series_uuid"),String::from("d37830fe-e7ac-4eb6-80c7-eda31c7fc2fc"));
    let mut f2: HashMap<String,HashMap<String, String>> = HashMap::default();
    f2.insert(String::from("book"), filters);
    let body = dcuniverse_api::json_search::build_search_json_body(String::from(engine_key), page, per_page, vec!(String::from("book")), Option::from(h2),None, Option::from(f2));

    client.post(String::from(search_url))
        .body(serde_json::to_string(&body).unwrap())
        .send()?.json()
}