const bookmarkList = document.querySelector("#bookmark-list");
const form = document.querySelector("#add-bookmark-form");

// create element & render bookmark

function renderBookmark(doc) {
    let li = document.createElement("li");
    let name = document.createElement("span");
    let author = document.createElement("span");
    let gener = document.createElement("span");
    let review = document.createElement("span");
    let series = document.createElement("span");
    let total = document.createElement("span");
    let curent = document.createElement("span");
    let start = document.createElement("span");
    let last = document.createElement("span");
    let cross = document.createElement('div');

    li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    author.textContent = doc.data().author;
    gener.textContent = doc.data().gener;
    review.textContent = doc.data().review;
    series.textContent = doc.data().series;
    total.textContent = doc.data().total;
    curent.textContent = doc.data().curent;
    last.textContent = doc.data().last;
    start.textContent = doc.data().start;
    cross.textContent = 'x';
    total.jsonContent = doc.data().series;

    li.appendChild(name);
    li.appendChild(author);
    li.appendChild(gener);
    li.appendChild(review);
    li.appendChild(series);
    li.appendChild(total);
    li.appendChild(cross);
    li.appendChild(curent);
    li.appendChild(last);
    li.appendChild(start);

    bookmarkList.appendChild(li);

    // deleting data
    cross.addEventListener('click', function (e) {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('bookmarks').doc(id).delete();
        db.collection('reviews').doc(id).delete();
    })
}

// listen for auth status changes

auth.onAuthStateChanged(user => {

    if (user) {

        //  getting books data if user loggin 

        console.log('user logged in: ', user);

        db.collection("bookmarks").get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {

                    renderBookmark(doc);

                });
            });

        db.collection("books").get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    renderBookmark(doc);
                });
            });

        db.collection("reviews").get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    renderBookmark(doc);
                });
            });

        // saving data
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            db.collection("bookmarks").add({
                useruid: user.uid,
                name: form.name.value,
                author: form.author.value,
                gener: form.gener.value,
                series: form.series.value,
                total: form.total.value,
                curent: form.curent.value,
                start: form.start.value,
                last: form.last.value
            });



            if (form.curent.value == form.total.value) {
                db.collection("reviews").add({
                    useruid: user.uid,
                    bookuid: "",
                    review: form.review.value,
                    rating: form.rating.value
                });
            }

            form.name.value = '';
            form.author.value = '';
            form.gener.value = '';
            form.review.value = '';
            form.rating.value = '';
            form.series.value = '';
            form.total.value = '';
            form.curent.value = '';
            form.start.value = '';
            form.last.value = '';
        });
    } else {
        console.log('user logged out');
    }
});