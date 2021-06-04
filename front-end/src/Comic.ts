
//What the backend returns for a comic
export interface Comic {
    requested?: string;
    readonly SeriesName: string;
    readonly SeriesUUID: string;
    readonly IssueNumber: number | null;
    readonly Authors: string[];
    readonly Colorists: string[];
    readonly CoverArtists: string[];
    readonly Inkers: string[];
    readonly Pencillers: string[];
    readonly Era: string;
    readonly Imprint: string;
    readonly Description: string;
    //TODO: make this into a proper date object, but this doesn't matter for now
    readonly ReleaseDate: string;
    readonly CharacterTags?: string[];
}

//the things necessary for the
export interface ComicRow extends Comic {
    isSelected: boolean;
    isExpanded: boolean;
    children?: ComicRow[]
}

//This is what is actually returned from API when requesting a comic using a csv, if there is only one child then I think we have a direct match
//Zero children, the user should browse for it
//More than one, display the tree for it
// export interface RequestedComic extends Comic{

//     children: ComicRow[]; 
// }


export function createTestRows(): ComicRow[]{
    const rows: ComicRow[] = []
for(let i = 0; i< 10; i++){
    const row: ComicRow = {
        isSelected: false,
        isExpanded: false,
        requested: `requested-${i}`,
        SeriesName: '',
        SeriesUUID:  '',
        IssueNumber: null ,
        Authors: [],
        Colorists: [],
        CoverArtists: [],
        Inkers: [],
        Pencillers: [],
        Era:  '',
        Imprint: '' ,
        Description: '' ,
        CharacterTags: [],
        ReleaseDate: '',
        children:  [
            {
                isSelected: false,
                isExpanded: false,
                SeriesName: 'Batman',
                SeriesUUID:  'batman',
                IssueNumber: 1 ,
                Authors: ['author1', 'author2'],
                Colorists: ['colorist'],
                CoverArtists: ['coverArtist'],
                Inkers: ['Inker'],
                Pencillers: ['Penciller'],
                Era:  'golden age',
                Imprint: 'DC' ,
                Description: 'description',
                CharacterTags: ['Batman', 'Robin'],
                ReleaseDate: '1915',
            }
        ]
        
    }
    rows.push(row);
}
return rows;
}