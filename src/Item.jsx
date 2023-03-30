import React from "react";

function Item(props) {
  const { index, user } = props;

  return (
    <tr key={index}>
      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
        {index + 1}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
        {user.key}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
        {user.name}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
        {user.address}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
        {user.phone}
      </td>
    </tr>
  );
}

export default Item;
