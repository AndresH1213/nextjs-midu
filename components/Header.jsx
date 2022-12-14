import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState, useRef } from 'react'

export default function Header() {
  const [results, setResults] = useState([])
  const searchRef = useRef();

  const { locale, locales } = useRouter()

  const getValue = () => searchRef.current?.value;

  const handleChange = (e) => {
    if (!e.target.value) {
      return setResults([])
    }
    const q = getValue()
    fetch(`/api/search?q=${q}`)
      .then(res => res.json())
      .then(searchResults => {
        setResults(searchResults)
      })
  }

  const restOfLocales = locales.filter(l => l !== locale);

  return <header className='flex justify-between items-center p-4 max-w-xl m-auto'>
    <h1 className='font-bold'>
      <Link href='/'>
        <a className='transition hover:opacity-80'>
          next<span className='font-light'>xkcd</span>
        </a>
      </Link>
    </h1>
    <nav>
      <ul className='flex flex-row gap-2'>
        <li><Link href='/'><a className='text-sm font-semibold'>Home</a></Link></li>
        <li><Link href='/' locale={restOfLocales[0]}><a className='text-sm font-semibold'>{restOfLocales[0]}</a></Link></li>
        <li>
          <input className='px-4 py-1 text-xs border border-gray-400 rounded-3xl' ref={searchRef} type='search' 
          onChange={handleChange}/>
          <div className='relative z-10'>
            {
              Boolean(results.length) && <div className='absolute bg-white top-0 left-0'>
                <ul className='w-full overflow-hidden border rounded-lg shadow-xl border-gray-50'>
                  <li className='m-0' key='all-results'>
                    <Link href={`/search?q=${getValue()}`}>
                      <a className='block italic text-gray-400 px-2 py-1 overflow-hidden text-sm font-semibold
                      hover:bg-slate-200 text-ellipsis whitespace-nowrap'>Ver {results.length} resultados</a>
                    </Link>
                  </li>
                  {
                    results.map(result => {
                      return (
                        <li className='m-0' key={result.id}>
                          <Link href={`/comic/${result.id}`}>
                            <a className='block px-2 py-1 overflow-hidden text-sm font-semibold
                            hover:bg-slate-200 text-ellipsis whitespace-nowrap'>{result.title}</a>
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            }
          </div>
        </li>
      </ul>
    </nav>
  </header>
}