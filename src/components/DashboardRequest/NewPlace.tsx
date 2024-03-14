// NewPlace.tsx
interface NewPlaceProps {
    placeName: string;
    placeDetails: string;
}

const NewPlace: React.FC<NewPlaceProps> = ({ placeName, placeDetails }) => {
    return (
        <div className="exampleUser">
            <h3>{placeName}</h3>
            <p>{placeDetails}</p>
            <button>modifier</button>
            <button>valider</button>
            <button>X</button>
        </div>
    );
};

export default NewPlace;
