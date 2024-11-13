const Label = ({children, ...props}) => {
  return(
    <label
      className="block text-sm/6 font-medium text-gray-900"
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
