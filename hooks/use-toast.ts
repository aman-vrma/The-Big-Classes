export function useToast() {
  const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
    if (variant === "destructive") {
      console.error(title, description);
      alert(`${title || "Error"}: ${description || ""}`);
    } else {
      console.log(title, description);
    }
  };

  return { toast };
}
