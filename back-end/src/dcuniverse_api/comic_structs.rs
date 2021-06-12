use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


pub trait QueryInfoTrait<L> {
    fn query_info(&self) -> QueryInfo;

    fn get_items(&self) -> Vec<L>;
}

#[derive(Serialize, Deserialize)]
pub struct JSONSearchSeries {
    pub record_count: i32,
    pub records: ComicSeriesRecords,
    pub info: InfoSeriesSearch,
}

impl QueryInfoTrait<ComicSeries> for JSONSearchSeries {
    fn query_info(&self) -> QueryInfo {
        self.info.comicseries.clone()
    }

    fn get_items(&self) -> Vec<ComicSeries> {
        self.records.comicseries.clone()
    }
}

#[derive(Serialize, Deserialize)]
pub struct JSONSearchComic {
    pub record_count: i32,
    pub records: ComicRecords,
    pub info: InfoBookSearch,
}

impl QueryInfoTrait<Comic> for JSONSearchComic {
    fn query_info(&self) -> QueryInfo {
        self.info.book.clone()
    }

    fn get_items(&self) -> Vec<Comic> {
        self.records.book.clone()
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
#[derive(Serialize, Deserialize, Clone, Debug)]
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

    //this will be used to determine whether or not we need to worry about an issue
    #[serde(with = "date_serde")]
    pub updated_at: DateTime<Utc>
}
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ComicSeries {
    pub books_count: i32,
    pub title: String,
    pub uuid: String,
}





mod date_serde {
    use chrono::prelude::*;
    use serde::{self, Deserialize, Serializer, Deserializer};

    const FORMAT: &str = "%+";

    pub fn serialize<S>(
        date: &DateTime<Utc>,
        serializer: S
    ) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
    let s = format!("{}", date.format(FORMAT));
    serializer.serialize_str(&s)
    }

    pub fn deserialize<'de, D>(
        deserializer: D,
    ) -> Result<DateTime<Utc>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Utc.datetime_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}

