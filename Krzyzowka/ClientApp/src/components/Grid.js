import React, { Component } from "react";
import Word from "./Word";
import Cell from "./Cell";

//use content loader
export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            solvedWords: [],
            words: [],
            wordsLoaded: false,
            currentWord: this.props.currentWord
        };
    }

    componentDidUpdate(prevProps) {
        let words = [];
        if (prevProps.currentWord !== this.props.currentWord) {
            this.setState(
                { currentWord: this.props.currentWord, wordsLoaded: false },
                console.log("GcDu", this.props.currentWord)
            );

        }
        if ( !this.state.wordsLoaded && this.props.data.numberOfWords === this.props.data.wordList.length ) {
            // WORDS are mapped each time CW rerenders?
            words = this.props.data.wordList.map((word, index) => (
                <Word
                    refer={this.props.data.refs[index]}
                    number={index}
                    numberOfWords={this.props.data.numberOfWords}
                    firstCharacter={this.props.data.firstLetters[index]}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={"w"+index}
                    length={word.length}
                    wordChange={this.handleWordChange}
                    addToRefs={this.props.addToRefs}
                    moveToNextCell={this.props.moveToNextCell}
                    moveToNextWord={this.props.moveToNextWord}
                    changeActiveCell={this.props.changeActiveCell}
                    currentWord={this.props.currentWord} 
                    />
            ));

            this.setState({
                wordsLoaded: true,
                words: words,
                currentWord: this.props.currentWord
            });
        }
    }

    componentDidMount() {
        let width = this.props.data.width; //ile komorek na wysokosc
        let height = this.props.data.height;
        let newGrid = [];

        for (let i = 1; i < width; i++) {
            for (let j = 1; j < height; j++) {
                newGrid.push( //tworzymy komórki
                    <Cell x={i} y={j} value={"-"} key={`${i}-${j}`} />
                );
            }
        }
        this.setState({ grid: newGrid }); //tu ustalam cały grid komórek
    }
  
            
    handleWordChange = (tuple) => {
        //the incoming tuple is an array, needs sorting by tuple.index
        let sorted = tuple.value.slice(0);
        let word = "";

        sorted.sort((a, b) => {
            return a.index - b.index;
        });

        sorted.forEach((e) => (word += e.value));


        this.props.addSolvedWord(
            { word: word, number: tuple.number },
            this.props.handleNewCurrentWord(this.props.currentWord)
        );

    };

    render() {
        // to wielkosc calej planszy w sensie jak duza jest wyswietlana
        const dim =" 0 0 " + (10 * this.props.data.width + 3) + " " + (10 * this.props.data.height + 3); 
        // to tworzymy komórki na uzupelnianie hasla
        return (
            <div className="grid_container">
                <svg viewBox={dim} xmlns="http://www.w3.org/2000/svg">
                    {this.state.grid}
                    {this.state.words}
                </svg>
            </div>
        );
    }
}