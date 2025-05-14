export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-6 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Melosa Bar. Todos los derechos reservados.</p>
        <p className="text-sm text-muted-foreground mt-1">Diseñado con cariño para ti.</p>
      </div>
    </footer>
  );
}
