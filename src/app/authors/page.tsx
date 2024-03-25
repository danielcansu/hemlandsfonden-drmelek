import AuthorCard from "@/components/AuthorCard";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Author } from "@/types";

const Authors = () => {
  const authorIndex: Author = getListPage("authors/_index.md");
  const authors: Author[] = getSinglePage("authors");
  const { title, meta_title, description, image } = authorIndex.frontmatter;
  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />
      <section className="section-sm pb-0">
        <div className="container">
          <div className="row justify-center">
            <div className="mb-14 md:col-6 lg:col-10">
              <h3 className="text-center mb-4">Styrelsen</h3>
              <p className="text-center">Styrelsens uppgifter är att förvalta fondens medel och fatta beslut avseende sådantsom rör Stiftelsens verksamhet. Detta innebär förvaltning av fondens medel för samordning av projekt, pris- och stipendieutdelningar, frågor kring nationella och internationella samarbeten samt insamlingskampanjer och andra frågor som är förenliga med Stiftelsens ändamål. Stiftelsens nuvarande styrelse valdes vid stiftelsens årsmöte 2023. Nästa mandatperiod startar år 2025. Info om styrelsen Styrelsen består av ordförande Athrin Aho, sekreterare Ramil Bisso, och ledamöter Tibel Aho, Niram-Karim Charo, Sheyno Besara Cansu och Chamiram Bisso Hanna. Representant från Assyriska föreningen är Alexandra Aho och representant från St Jacobs av Nsibins Syrisk ortodoxa kyrka är Nenos Shabow.</p>
            </div>
          </div>
          <div className="row justify-center">
            {authors.map((author: Author, index: number) => (
              <div className="mb-14 md:col-6 lg:col-4" key={index}>
                <AuthorCard data={author} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Authors;
