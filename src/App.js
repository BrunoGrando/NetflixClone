import react, { useEffect, useState} from "react";
import './App.css';
import Tmdb from "./Tmdb";
import FeaturedMovie from "./components/FeaturedMovie";
import MovieRow from "./components/MovieRow";
import Header from './components/Header'

export default () => {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFuteredData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFuteredData(chosenInfo);
      console.log(chosenInfo)
    }

    loadAll();
  }, []);


  useEffect(()=>{
    const scrolListener = () => {
      if(window.scrollY > 50){
        setBlackHeader(true);
      }
      else{
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrolListener);

    return () => {
      window.removeEventListener('scroll', scrolListener)
    }
  },[]);


  return(
    <div className="page">

      <Header black={blackHeader} />
    
    {featuredData &&
      <FeaturedMovie item={featuredData}/>
    }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      <footer>
        Feito por Bruno Grando<br />
        Direitos de imagem <br />
        Dados do site <a>Themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
      </div>
      }
    </div>
  )
}