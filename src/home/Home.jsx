import {useEffect, useState} from 'react';
import './Home.css';

function Home() {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');
    const [wordDef, setWordDef] = useState('');
    const [pronunciation, setPronunciation] = useState('');
    const [loading, setLoading] = useState(false);


    function newWord() {
        setLoading(true);
        fetch('https://random-word-api.herokuapp.com/word')
            .then((res) => res.json())
            .then((data) => {
                setWord(data[0]);
                setDefinition("")
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function translate() {
        fetch("http://127.0.0.1:5000/translate", {
            method: "POST",
            body: JSON.stringify({
                q: wordDef,  // Passer la définition à traduire
                source: "en",  // Langue source : anglais
                target: "fr",  // Langue cible : français
                format: "text",
            }),
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(data => {
                setDefinition(data.translatedText);  // Met à jour l'état avec la traduction
            })
            .catch(error => {
                console.error("Erreur lors de la traduction : ", error);
                setDefinition('Erreur lors de la traduction');
            });
    }

    useEffect(() => {
        if (word) {
            let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data[0] && data[0].meanings) {
                        const definition = data[0].meanings[0].definitions[0].definition;
                        const pronunciation = data[0].phonetic || 'No pronunciation found';
                        setPronunciation(pronunciation);
                        setWordDef(definition);
                    } else {
                        setWordDef('no definition found');
                        setPronunciation('');
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération de la définition : ", error);
                    setWordDef('Erreur lors de la récupération de la définition');
                    setLoading(false);
                });
        }
    }, [word]);

    return (
        <>
            <div className="container">
                <button onClick={newWord} className="big-button">Discover a New Word</button>

                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {word && (
                            <div>
                                <h1>Word: {word}</h1>
                                <h2>Pronunciation: {pronunciation}</h2>
                                <h2 className='definition'>Definition: {wordDef}</h2>
                                <button className='littleButton' onClick={translate}>Translate definition</button>
                                {definition && (<h2>Translation: {definition}</h2>)}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Home;
