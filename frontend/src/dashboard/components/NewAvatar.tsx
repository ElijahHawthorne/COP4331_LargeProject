

interface Props {
  currentFirstname: string|null;
}

const NewAvatar = ({ currentFirstname }: Props) => {
  const firstLetter = (currentFirstname ? currentFirstname.charAt(0).toUpperCase() : "?");

  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#33ccff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
      }}
    >
      {firstLetter}
    </div>
  );
};

export default NewAvatar;
