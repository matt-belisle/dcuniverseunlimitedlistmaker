import { useEffect, useState } from 'react'
import { Comic } from './Comic'

interface ComicInformationProps {
    comic: Comic
}
export default function ComicInformation(props: ComicInformationProps){

    const formatArray = (arr: String[]) => arr.join(", ")

    return (<div className={'ComicInformation'}>
        <div>
            <span>Series: {props.comic.SeriesName}</span>
            <span>Issue: {props.comic.IssueNumber}</span>
            <span>Cover Artists: {formatArray(props.comic.CoverArtists)}</span>
            <span>Authors: {formatArray(props.comic.Authors)}</span>
            <span>Colorists: {formatArray(props.comic.Colorists)}</span>
            <span>Inkers: {formatArray(props.comic.Inkers)}</span>
            <span>Pencillers: {formatArray(props.comic.Pencillers)}</span>
            <span>Era: {props.comic.Era}</span>
            <span>Imprint: {props.comic.Imprint}</span>
            <span>Year Published: {props.comic.ReleaseDate}</span>
            {props.comic.CharacterTags !== undefined && <span>Characters: {formatArray(props.comic.CharacterTags)}</span>}
            <span>Description: {props.comic.Description}</span>
        </div>

    </div>)


}