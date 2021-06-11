use super::comic_structs;
use super::comic_structs::QueryInfoTrait;
use reqwest::Result;



//D is what is deserialized from the api, so on the first call we can call the api and get the remainder of the items
pub struct WebAPIIterator<L, J: QueryInfoTrait<L>> {
    client: reqwest::blocking::Client,
    info: Option<comic_structs::QueryInfo>,
    page: i32,
    per_page: i32,
    items: <Vec<L> as IntoIterator>::IntoIter,
    build_request: fn(reqwest::blocking::Client, i32, i32) -> Result<J>,
}

impl<L, J: QueryInfoTrait<L>> WebAPIIterator<L, J> {
    pub fn of(
        client: reqwest::blocking::Client,
        build_request: fn(reqwest::blocking::Client, i32, i32) -> Result<J>,
    ) -> Self {
        WebAPIIterator {
            // _phantom_data: PhantomData,
            client,
            info: None,
            page: 0,
            per_page: 100,
            items: vec![].into_iter(),
            build_request,
        }
    }

    fn try_next(&mut self) -> Result<Option<L>> {
        if let Some(item) = self.items.next() {
            return Ok(Some(item));
        }

        //this means we've tried before and succesfully gotten one page, so the info will contain everything we need
        if self.info.is_some() && self.page > self.info.as_ref().unwrap().num_pages {
            return Ok(None);
        }

        self.page += 1;
        //query the api, if we dont have a query info then this will also set it if its not set, which will then determine the rest of it
        let response = (self.build_request)(self.client.clone(), self.page, self.per_page)?;

        self.items = response.get_items().into_iter();
        if self.info.is_none() {
            self.info = Some(response.query_info());
        }
        Ok(self.items.next())
    }
}

impl<L, J: QueryInfoTrait<L>> Iterator for WebAPIIterator<L, J> {
    type Item = Result<L>;

    fn next(&mut self) -> Option<Self::Item> {
        match self.try_next() {
            Ok(Some(item)) => Some(Ok(item)),
            Ok(None) => None,
            Err(err) => Some(Err(err)),
        }
    }
}