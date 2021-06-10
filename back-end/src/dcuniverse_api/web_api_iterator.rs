
//D is what is deserialized from the api, so on the first call we can call the api and get the remainder of the items
struct WebAPIIterator<D: impl QueryInfoTrait> {
    client: reqwest::Client,
    url: String,
    info: Option<QueryInfo>,
    page: u32,
    per_page: u32,
    items: <Vec<D> as IntoIterator>::IntoIter
}

impl WebAPIIterator {
    fn of(client: reqwest::Client, url: String) -> Result<Self>{
        Ok(WebAPIIterator {
            client,
            url, 
            None,
            0,
            100,
            vec![].into_iter()
        })
    }

    fn try_next(&mut self) -> Result<Option<D>> {

    }
}

impl Iterator for WebAPIIterator {
    type Item = Result<D>;

    fn next(&mut self) -> Option<Self::Item> {
        match self.try_next() {
            Ok(Some(item)) => Some(Ok(item)),
            Ok(None) => None,
            Err(err) => Some(Err(err))
        }
    }
}