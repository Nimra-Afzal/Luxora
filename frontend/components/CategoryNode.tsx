import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  slug: string;
  children?: Category[];
};

export default function CategoryNode({ category }: { category: Category }) {
  return (
    <li>
      <Link href={`/category/${category.slug}`}>
        {category.name}
      </Link>

      {category.children && category.children.length > 0 && (
        <ul style={{ marginLeft: "16px" }}>
          {category.children.map((child) => (
            <CategoryNode key={child._id} category={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
