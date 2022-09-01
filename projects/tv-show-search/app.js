const form = document.getElementById('searchForm');
form.addEventListener('submit', async function(e){
    e.preventDefault();
    const searchTerm = form.elements.query.value;
    const config = { params: {q:searchTerm} }
    const res = await axios.get(`http://api.tvmaze.com/search/shows`, config)
    displayImages(res.data)
    form.elements.query.value = ''
})

const displayImages =(shows)=>{
    for(let tvshow of shows){
        if(tvshow.show.image){
            const img = document.createElement('IMG')
            img.src = tvshow.show.image.medium
            document.body.append(img)
        }
        
    }
}