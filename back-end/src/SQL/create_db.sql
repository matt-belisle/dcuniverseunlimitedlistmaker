--obviously this drop here is temporary, while i am building up the db...
DROP DATABASE DCUniverseUnlimited;
CREATE DATABASE IF NOT EXISTS DCUniverseUnlimited;
USE DCUniverseUnlimited;
CREATE TABLE IF NOT EXISTS `Creator`
(
 `ID`   int NOT NULL AUTO_INCREMENT ,
 `Name` varchar(45) NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `Era`
(
 `ID`   int NOT NULL AUTO_INCREMENT ,
 `Name` varchar(45) NOT NULL ,

PRIMARY KEY (`ID`)
);


CREATE TABLE IF NOT EXISTS `Imprint`
(
 `ID`   int NOT NULL AUTO_INCREMENT ,
 `Name` varchar(45) NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `Series`
(
 `ID`   int NOT NULL AUTO_INCREMENT ,
 `Name` varchar(45) NOT NULL ,
 `UUID` varchar(45) NOT NULL ,

PRIMARY KEY (`ID`)
);

CREATE TABLE IF NOT EXISTS `Character`
(
 `ID`   int NOT NULL AUTO_INCREMENT ,
 `Name` varchar(45) NOT NULL ,

PRIMARY KEY (`ID`)
);



CREATE TABLE IF NOT EXISTS `Issue`
(
 `ID`          int NOT NULL AUTO_INCREMENT ,
 `SeriesID`    int NOT NULL ,
 `IssueNumber` int NOT NULL ,
 `IssueType`   varchar(45) NOT NULL ,
 `UUID`        varchar(45) NOT NULL ,
 `ReleaseDate` datetime NOT NULL ,
 `Description` varchar(45) NOT NULL ,
 `EraID`       int NOT NULL ,
 `ImprintID`   int NOT NULL ,
 `UpdatedAt`   datetime NOT NULL ,

PRIMARY KEY (`ID`),
KEY `fkIdx_10` (`SeriesID`),
CONSTRAINT `FK_9` FOREIGN KEY `fkIdx_10` (`SeriesID`) REFERENCES `Series` (`ID`),
KEY `fkIdx_82` (`EraID`),
CONSTRAINT `FK_81` FOREIGN KEY `fkIdx_82` (`EraID`) REFERENCES `Era` (`ID`),
KEY `fkIdx_85` (`ImprintID`),
CONSTRAINT `FK_84` FOREIGN KEY `fkIdx_85` (`ImprintID`) REFERENCES `Imprint` (`ID`)
);

CREATE TABLE IF NOT EXISTS `Authors`
(
 `AuthorID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`AuthorID`, `ComicID`),
KEY `fkIdx_33` (`AuthorID`),
CONSTRAINT `FK_32` FOREIGN KEY `fkIdx_33` (`AuthorID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38` (`ComicID`),
CONSTRAINT `FK_37` FOREIGN KEY `fkIdx_38` (`ComicID`) REFERENCES `Issue` (`ID`)
);

CREATE TABLE IF NOT EXISTS `Inkers`
(
 `InkerID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`InkerID`, `ComicID`),
KEY `fkIdx_33_clone_clone_clone` (`InkerID`),
CONSTRAINT `FK_32_clone_clone_clone` FOREIGN KEY `fkIdx_33_clone_clone_clone` (`InkerID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38_clone_clone_clone` (`ComicID`),
CONSTRAINT `FK_37_clone_clone_clone` FOREIGN KEY `fkIdx_38_clone_clone_clone` (`ComicID`) REFERENCES `Issue` (`ID`)
);



CREATE TABLE IF NOT EXISTS `Pencillers`
(
 `PencillerID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`PencillerID`, `ComicID`),
KEY `fkIdx_33_clone` (`PencillerID`),
CONSTRAINT `FK_32_clone` FOREIGN KEY `fkIdx_33_clone` (`PencillerID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38_clone` (`ComicID`),
CONSTRAINT `FK_37_clone` FOREIGN KEY `fkIdx_38_clone` (`ComicID`) REFERENCES `Issue` (`ID`)
);

CREATE TABLE IF NOT EXISTS `Colorists`
(
 `ColoristID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`ColoristID`, `ComicID`),
KEY `fkIdx_33_clone_clone_clone_clone` (`ColoristID`),
CONSTRAINT `FK_32_clone_clone_clone_clone` FOREIGN KEY `fkIdx_33_clone_clone_clone_clone` (`ColoristID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38_clone_clone_clone_clone` (`ComicID`),
CONSTRAINT `FK_37_clone_clone_clone_clone` FOREIGN KEY `fkIdx_38_clone_clone_clone_clone` (`ComicID`) REFERENCES `Issue` (`ID`)
);

CREATE TABLE IF NOT EXISTS `CoverArtists`
(
 `CoverArtistID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`CoverArtistID`, `ComicID`),
KEY `fkIdx_33_clone_clone` (`CoverArtistID`),
CONSTRAINT `FK_32_clone_clone` FOREIGN KEY `fkIdx_33_clone_clone` (`CoverArtistID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38_clone_clone` (`ComicID`),
CONSTRAINT `FK_37_clone_clone` FOREIGN KEY `fkIdx_38_clone_clone` (`ComicID`) REFERENCES `Issue` (`ID`)
);

CREATE TABLE IF NOT EXISTS `Inkers`
(
 `InkerID` int NOT NULL ,
 `ComicID`  int NOT NULL ,

PRIMARY KEY (`InkerID`, `ComicID`),
KEY `fkIdx_33_clone_clone_clone` (`InkerID`),
CONSTRAINT `FK_32_clone_clone_clone` FOREIGN KEY `fkIdx_33_clone_clone_clone` (`InkerID`) REFERENCES `Creator` (`ID`),
KEY `fkIdx_38_clone_clone_clone` (`ComicID`),
CONSTRAINT `FK_37_clone_clone_clone` FOREIGN KEY `fkIdx_38_clone_clone_clone` (`ComicID`) REFERENCES `Issue` (`ID`)
);

CREATE TABLE IF NOT EXISTS `CharacterTags`
(
 `CharacterID` int NOT NULL ,
 `IssueID`     int NOT NULL ,

PRIMARY KEY (`CharacterID`, `IssueID`),
KEY `fkIdx_74` (`CharacterID`),
CONSTRAINT `FK_73` FOREIGN KEY `fkIdx_74` (`CharacterID`) REFERENCES `Character` (`ID`),
KEY `fkIdx_78` (`IssueID`),
CONSTRAINT `FK_77` FOREIGN KEY `fkIdx_78` (`IssueID`) REFERENCES `Issue` (`ID`)
);






