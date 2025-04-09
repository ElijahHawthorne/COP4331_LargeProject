

interface Props {
  currentFirstname: string|null;
}

const NewAvatar = ({ currentFirstname }: Props) => {
  // Get the first letter of the currentFirstname
  const firstLetter = (currentFirstname ? currentFirstname.charAt(0).toUpperCase() : "?");

  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',  // Make it circular
        backgroundColor: '#33ccff',  // You can change the background color
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',  // Text color
        fontSize: '24px',  // Font size for the letter
        fontWeight: 'bold',  // Make the letter bold
      }}
    >
      {firstLetter}
    </div>
  );
};

export default NewAvatar;
