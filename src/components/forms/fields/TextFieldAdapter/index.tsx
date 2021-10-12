import TextField from '@mui/material/TextField';

const TextFieldAdapter = ({input, meta, ...rest}: any) => {
  return (
    <TextField
      {...input}
      {...rest}
      onChange={(event: any) => input.onChange(event.target.value)}
    />
  );
};

export default TextFieldAdapter;
