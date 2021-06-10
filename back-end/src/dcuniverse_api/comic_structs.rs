use serde::{Deserialize, Serialize};

trait QueryInfoTrait {
    fn query_info(&self) -> QueryInfo;
}

#[derive(Serialize, Deserialize)]
pub struct JSONSearchSeries {
    pub record_count: i32,
    pub records: ComicSeriesRecords,
    pub info: InfoSeriesSearch,
}

impl QueryInfoTrait for JSONSearchSeries {
    fn query_info(&self) -> QueryInfo {
        self.info.comicseries.clone()
    }
}

#[derive(Serialize, Deserialize)]
pub struct JSONSearchComic {
    pub record_count: i32,
    pub records: ComicRecords,
    pub info: InfoBookSearch,
}

impl QueryInfoTrait for JSONSearchComic {
    fn query_info(&self) -> QueryInfo {
        self.info.book.clone()
    }
}



#[derive(Serialize, Deserialize)]
pub struct InfoSeriesSearch {
    pub comicseries: QueryInfo,
}

#[derive(Serialize, Deserialize)]
pub struct InfoBookSearch {
    pub book: QueryInfo,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct QueryInfo {
    pub current_page: i32,
    pub num_pages: i32,
    pub per_page: i32,
    pub total_result_count: i32,
}
#[derive(Serialize, Deserialize)]
pub struct ComicSeriesRecords {
    pub comicseries: Vec<ComicSeries>,
}

#[derive(Serialize, Deserialize)]
pub struct ComicRecords {
    pub book: Vec<Comic>,
}
#[derive(Serialize, Deserialize)]
pub struct Comic {
    pub inkers: Option<Vec<String>>,    
    pub uuid: String,
    pub colorists: Option<Vec<String>>,
    pub era: Option<Vec<String>>,
    pub pencillers: Option<Vec<String>>,
    pub authors: Option<Vec<String>>,
    pub cover_artists: Option<Vec<String>>,
    pub character_tags: Option<Vec<String>>,
    pub imprints: Option<Vec<String>>,
    pub first_released: String,
    pub issue_number: String,
    pub series_index: i32,
    pub description: String,
}
#[derive(Serialize, Deserialize)]
pub struct ComicSeries {
    pub books_count: i32,
    pub title: String,
    pub uuid: String,
}


