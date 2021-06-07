//What the backend returns for a comic
export interface Comic {
  requested?: string;
  readonly SeriesName: string;
  readonly SeriesUUID: string;
  readonly IssueNumber?: number;
  //All comics from backend should come with a UUID
  readonly UUID?: string;
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
  children?: ComicRow[];
}

//This is what is actually returned from API when requesting a comic using a csv, if there is only one child then I think we have a direct match
//Zero children, the user should browse for it
//More than one, display the tree for it
// export interface RequestedComic extends Comic{

//     children: ComicRow[];
// }
function rand(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
export function createTestRows(): ComicRow[] {
  const rows: ComicRow[] = [];
  for (let i = 0; i < 4; i++) {
    const row: ComicRow = {
      isSelected: false,
      isExpanded: false,
      SeriesName: "",
      SeriesUUID: "",
      requested: `requested-${i}`,
      Authors: [],
      Colorists: [],
      CoverArtists: [],
      Inkers: [],
      Pencillers: [],
      Era: "",
      Imprint: "",
      Description: "",
      CharacterTags: [],
      ReleaseDate: "",
      children: [
        {
          isSelected: false,
          isExpanded: false,
          SeriesName: "Batman",
          SeriesUUID: "batman",
          UUID: rand(),
          IssueNumber: 1,
          Authors: ["author1", "author2"],
          Colorists: ["colorist"],
          CoverArtists: ["coverArtist"],
          Inkers: ["Inker"],
          Pencillers: ["Penciller"],
          Era: "golden age",
          Imprint: "DC",
          Description: "description",
          CharacterTags: ["Batman", "Robin"],
          ReleaseDate: "1915",
        },
      ],
    };
    rows.push(row);
  }
  const row: ComicRow = {
    isSelected: false,
    isExpanded: false,
    SeriesName: "",
    SeriesUUID: "",
    requested: `requested-11`,
    Authors: [],
    Colorists: [],
    CoverArtists: [],
    Inkers: [],
    Pencillers: [],
    Era: "",
    Imprint: "",
    Description: "",
    CharacterTags: [],
    ReleaseDate: "",
    children: [
      {
        isSelected: false,
        isExpanded: false,
        SeriesName: "Batman",
        SeriesUUID: "batman",
        IssueNumber: 1,
        UUID: rand(),
        Authors: ["author1", "author2"],
        Colorists: ["colorist"],
        CoverArtists: ["coverArtist"],
        Inkers: ["Inker"],
        Pencillers: ["Penciller"],
        Era: "golden age",
        Imprint: "DC",
        Description: "description",
        CharacterTags: ["Batman", "Robin"],
        ReleaseDate: "1915",
      },
      {
        isSelected: false,
        isExpanded: false,
        SeriesName: "Superman",
        SeriesUUID: "batman",
        IssueNumber: 1,
        Authors: ["author1", "author2"],
        Colorists: ["colorist"],
        UUID: rand(),
        CoverArtists: ["coverArtist"],
        Inkers: ["Inker"],
        Pencillers: ["Penciller"],
        Era: "golden age",
        Imprint: "DC",
        Description: "description",
        CharacterTags: ["Batman", "Robin"],
        ReleaseDate: "1915",
      },
    ],
  };
  rows.push(row);
  return rows;
}

export function baseComicRow(
  requested: string | undefined,
  isSelected: boolean,
  isExpanded: boolean,
  children: ComicRow[]
): ComicRow {
  return {
    isSelected: isSelected,
    isExpanded: isExpanded,
    SeriesName: "",
    SeriesUUID: "",
    requested: requested,
    Authors: [],
    Colorists: [],
    CoverArtists: [],
    Inkers: [],
    Pencillers: [],
    Era: "",
    Imprint: "",
    Description: "",
    CharacterTags: [],
    ReleaseDate: "",
    children: children,
  };
}
