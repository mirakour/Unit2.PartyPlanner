
// API Endpoint
const apiUrl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events"

// State Object to store fetched events
const state = {
    parties: []
}

// Function to fetch and render parties
const fetchParties = async () => {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        state.parties = data.data //store events in state
        renderParties()
    } catch (error) {
        console.error("Error fetching parties:", error)
    }
}

// Function to render parties
const renderParties = () => {
    const container = document.querySelector("#parties-container")
    container.innerHTML = "" //clear previous content

    state.parties.forEach(party => {
        const partyCard = document.createElement("div")
        partyCard.classList.add("party-card")

        partyCard.innerHTML = `
            <h3>${party.name}</h3>
            <p><strong>Date:</strong> ${new Date(party.date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${party.location}</p>
            <p>${party.description}</p>
            <button class="delete-btn" data-id="${party.id}">Delete</button>
        `
        container.appendChild(partyCard)
    })

    // Add Event listener to delete buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const partyId = event.target.getAttribute("data-id")
            deleteParty(partyId)
        })
    })
}

//Function to add a new party
const addParty = async (event) => {
    event.preventDefault() //prevent default from submission

    const name = document.querySelector("#party-name").value.trim()
    const description = document.querySelector("#party-description").value.trim()
    const date = document.querySelector("#party-date").value
    const location = document.querySelector("#party-location").value.trim()

    if (!name || !description || !date || !location) {
        alert("Please fill out all fields")
        return
    }

    const newParty = {name, description, date, location}

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newParty)
        })

        const data = await response.json()
        state.parties.push(data.data) //update state
        renderParties()
        document.querySelector("new-party-form").reset() //clear form
    } catch (error) {
        console.error("Error adding party:", error)
    }
}

// Fucntion to delete a party
const deleteParty = async (partyId) => {
    try {
        await fetch(`${apiUrl}/${partyId}`, {method: "DELETE"})

        // Update state by filtering out deleted party
        state.parties = state.parties.filter(party => party.id !== Number(partyId))
        renderParties()
    } catch (error) {
        console.error("Error deleting party:", error)
    }
}

// Event listener for adding parties
document.querySelector("#new-party-form").addEventListener("submit", addParty)

// Initial fetch and render
fetchParties();