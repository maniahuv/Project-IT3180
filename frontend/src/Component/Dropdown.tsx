import {
    useState,
    createContext,
    useContext,
    PropsWithChildren,
    Dispatch,
    SetStateAction,
    AnchorHTMLAttributes,
  } from 'react';
  import { Transition } from '@headlessui/react';
  
  // Context quản lý trạng thái dropdown
  const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
  }>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
  });
  
  // Component chính Dropdown
  const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);
  
    const toggleOpen = () => setOpen((prev) => !prev);
  
    return (
      <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
        <div className="relative">{children}</div>
      </DropDownContext.Provider>
    );
  };
  
  // Trigger để bật/tắt dropdown
  const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);
  
    return (
      <>
        <div onClick={toggleOpen}>{children}</div>
        {open && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}
      </>
    );
  };
  
  // Content chứa menu item
  const Content = ({
    align = 'left',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
  }: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48' | '56' | '64';
    contentClasses?: string;
  }>) => {
    const { open, setOpen } = useContext(DropDownContext);
  
    const alignmentClasses =
      align === 'right'
        ? 'ltr:origin-top-right rtl:origin-top-left end-0'
        : 'ltr:origin-top-left rtl:origin-top-right start-0';
  
    const widthClasses = {
      '48': 'w-48',
      '56': 'w-56',
      '64': 'w-64',
    }[width] || 'w-48';
  
    return (
      <Transition
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}
          >
            {children}
          </div>
        </div>
      </Transition>
    );
  };
  
  // Link item bên trong dropdown - dùng thẻ <a>
  const DropdownLink = ({
    className = '',
    children,
    href = '#',
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a
        href={href}
        {...props}
        className={
          'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ' +
          className
        }
      >
        {children}
      </a>
    );
  };
  
  // Gắn các thành phần vào Dropdown
  Dropdown.Trigger = Trigger;
  Dropdown.Content = Content;
  Dropdown.Link = DropdownLink;
  
  export default Dropdown;
  